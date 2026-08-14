export type DaySchedule = { startTime: string; endTime: string };

export function parseSchedule(schedule: string | null): {
  days: string[];
  sameTime: boolean;
  uniformStart: string;
  uniformEnd: string;
  perDay: Record<string, DaySchedule>;
} {
  const empty = { days: [], sameTime: true, uniformStart: '', uniformEnd: '', perDay: {} };
  if (!schedule) return empty;

  if (schedule.includes(' · ')) {
    const [daysPart, timePart] = schedule.split(' · ');
    const days = daysPart.split(', ').map(d => d.trim());
    const [start, end] = (timePart || '').split('-').map(t => t.trim());
    return { days, sameTime: true, uniformStart: start || '', uniformEnd: end || '', perDay: {} };
  }

  const parts = schedule.split(', ').map(p => p.trim());
  const days: string[] = [];
  const perDay: Record<string, DaySchedule> = {};
  for (const part of parts) {
    const match = part.match(/^(\S+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
    if (match) {
      days.push(match[1]);
      perDay[match[1]] = { startTime: match[2], endTime: match[3] };
    }
  }
  return { days, sameTime: false, uniformStart: '', uniformEnd: '', perDay };
}

export function buildScheduleString(
  selectedDays: string[],
  sameTime: boolean,
  uniformStart: string,
  uniformEnd: string,
  perDay: Record<string, DaySchedule>
): string {
  if (selectedDays.length === 0) return '';
  if (sameTime && uniformStart && uniformEnd) {
    return `${selectedDays.join(', ')} · ${uniformStart}-${uniformEnd}`;
  }
  return selectedDays
    .map(d => (perDay[d]?.startTime && perDay[d]?.endTime ? `${d} ${perDay[d].startTime}-${perDay[d].endTime}` : null))
    .filter(Boolean)
    .join(', ');
}

// Convert "HH:MM" to minutes since midnight
function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Check if two time ranges overlap (start1, end1, start2, end2 in minutes)
function rangesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
  return Math.max(start1, start2) < Math.min(end1, end2);
}

// Check if a specific host is available for a given new schedule
export function isZoomHostAvailableForGroup(
  host: any,
  newScheduleStr: string,
  ignoreGroupId: string | null = null
): boolean {
  if (!newScheduleStr) return true;
  const newSched = parseSchedule(newScheduleStr);
  if (newSched.days.length === 0) return true;

  // 1. Check against host's other assigned groups
  if (host.assignedGroups) {
    for (const group of host.assignedGroups) {
      if (ignoreGroupId && group.id === ignoreGroupId) continue;
      
      const existingSched = parseSchedule(group.schedule);
      
      // Find common days (taking accents into account if needed, but since both use DAYS constants it should match exactly)
      const commonDays = newSched.days.filter(d => 
        existingSched.days.includes(d) || 
        existingSched.days.includes(d.replace('Sáb','Sab').replace('Mié','Mier').replace('Vie','Vier')) ||
        existingSched.days.includes(d.replace('Sab','Sáb').replace('Mier','Mié').replace('Vier','Vie'))
      );
      
      for (const day of commonDays) {
        // Need to extract the time from the correct matching day in existingSched
        const existingDayMatched = existingSched.days.find(d => 
            d === day || 
            d === day.replace('Sáb','Sab').replace('Mié','Mier').replace('Vie','Vier') ||
            d === day.replace('Sab','Sáb').replace('Mier','Mié').replace('Vier','Vie')
        ) || day;

        const newStart = newSched.sameTime ? newSched.uniformStart : newSched.perDay[day]?.startTime;
        const newEnd = newSched.sameTime ? newSched.uniformEnd : newSched.perDay[day]?.endTime;
        
        const existStart = existingSched.sameTime ? existingSched.uniformStart : existingSched.perDay[existingDayMatched]?.startTime;
        const existEnd = existingSched.sameTime ? existingSched.uniformEnd : existingSched.perDay[existingDayMatched]?.endTime;

        if (newStart && newEnd && existStart && existEnd) {
          if (rangesOverlap(timeToMinutes(newStart), timeToMinutes(newEnd), timeToMinutes(existStart), timeToMinutes(existEnd))) {
            return false; // Collision found!
          }
        }
      }
    }
  }

  // 2. Check against host's individual meetings
  if (host.meetings) {
    const dayMapNoAccent = ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sáb'];
    for (const meeting of host.meetings) {
      const meetingDate = new Date(meeting.scheduledAt);
      const meetingDayStr = dayMapNoAccent[meetingDate.getDay()];
      
      if (newSched.days.includes(meetingDayStr) || newSched.days.includes(meetingDayStr.replace('Mier', 'Mié').replace('Vier', 'Vie').replace('Sab', 'Sáb'))) {
         const newStart = newSched.sameTime ? newSched.uniformStart : newSched.perDay[meetingDayStr]?.startTime;
         const newEnd = newSched.sameTime ? newSched.uniformEnd : newSched.perDay[meetingDayStr]?.endTime;
         
         const meetingStartMins = meetingDate.getHours() * 60 + meetingDate.getMinutes();
         const meetingEndMins = meetingStartMins + Math.floor((meeting.durationExpected || 3600) / 60);

         if (newStart && newEnd) {
           if (rangesOverlap(timeToMinutes(newStart), timeToMinutes(newEnd), meetingStartMins, meetingEndMins)) {
             return false;
           }
         }
      }
    }
  }

  return true;
}

export function isZoomHostAvailableForClass(
  host: any,
  classDateStr: string,
  classTimeStr: string,
  durationExpectedSec: number = 3600,
  ignoreClassId: string | null = null
): boolean {
  if (!classDateStr || !classTimeStr) return true;

  const classStartMins = timeToMinutes(classTimeStr);
  const classEndMins = classStartMins + Math.floor(durationExpectedSec / 60);



  // 2. Check against other individual meetings
  if (host.meetings) {
    const classDateOnly = classDateStr;
    for (const meeting of host.meetings) {
      if (ignoreClassId && meeting.id === ignoreClassId) continue;
      
      const meetingDate = new Date(meeting.scheduledAt);
      const meetingDateOnly = meetingDate.toISOString().split('T')[0];
      
      if (meetingDateOnly === classDateOnly) {
         const meetingStartMins = meetingDate.getHours() * 60 + meetingDate.getMinutes();
         const meetingEndMins = meetingStartMins + Math.floor((meeting.durationExpected || 3600) / 60);

         if (rangesOverlap(classStartMins, classEndMins, meetingStartMins, meetingEndMins)) {
           return false;
         }
      }
    }
  }

  return true;
}
