// Seed 3 existing students as ENROLLED leads in the CRM
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get the 3 students
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true },
  });

  console.log(`Found ${students.length} students:`, students.map(s => `${s.firstName} ${s.lastName}`));

  for (const student of students) {
    // Check if a lead already exists for this student
    const existing = await prisma.lead.findFirst({
      where: { convertedToUserId: student.id },
    });

    if (existing) {
      console.log(`⏭️  Lead already exists for ${student.firstName} ${student.lastName}`);
      continue;
    }

    const lead = await prisma.lead.create({
      data: {
        name: `${student.firstName} ${student.lastName || ''}`.trim(),
        phone: student.phone || '+52 000 000 0000',
        email: student.email,
        source: 'WHATSAPP_ORGANIC',
        status: 'ENROLLED',
        interestedIn: 'Grupal Regular',
        notes: 'Alumno existente — migrado al CRM',
        convertedToUserId: student.id,
      },
    });

    console.log(`✅ Created lead for ${student.firstName}: ${lead.id}`);
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
