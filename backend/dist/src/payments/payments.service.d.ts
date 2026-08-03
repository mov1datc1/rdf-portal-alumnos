import { PrismaService } from '../prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllEnrollments(): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        level: {
            id: string;
            name: string;
            levelCode: string;
        };
        payments: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string | null;
            enrollmentId: string;
            amount: number;
            paidAt: Date | null;
            reference: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        levelId: string;
        userId: string;
        planType: string;
        monthlyFee: number;
        startDate: Date;
        endDate: Date | null;
    })[]>;
    createEnrollment(data: any): Promise<{
        user: {
            firstName: string | null;
            lastName: string | null;
        };
        level: {
            name: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        levelId: string;
        userId: string;
        planType: string;
        monthlyFee: number;
        startDate: Date;
        endDate: Date | null;
    }>;
    updateEnrollment(id: string, data: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        levelId: string;
        userId: string;
        planType: string;
        monthlyFee: number;
        startDate: Date;
        endDate: Date | null;
    }>;
    deleteEnrollment(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        levelId: string;
        userId: string;
        planType: string;
        monthlyFee: number;
        startDate: Date;
        endDate: Date | null;
    }>;
    getAllPayments(): Promise<({
        enrollment: {
            user: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            level: {
                name: string;
                levelCode: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            levelId: string;
            userId: string;
            planType: string;
            monthlyFee: number;
            startDate: Date;
            endDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        method: string | null;
        enrollmentId: string;
        amount: number;
        paidAt: Date | null;
        reference: string | null;
    })[]>;
    createPayment(data: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        method: string | null;
        enrollmentId: string;
        amount: number;
        paidAt: Date | null;
        reference: string | null;
    }>;
    deletePayment(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        method: string | null;
        enrollmentId: string;
        amount: number;
        paidAt: Date | null;
        reference: string | null;
    }>;
    getAnalytics360(): Promise<{
        summary: {
            totalStudents: number;
            totalTeachers: number;
            totalGroups: number;
            activeEnrollments: number;
            totalLeads: number;
            enrolledLeads: number;
            conversionRate: string;
            costPerStudent: number | null;
        };
        revenue: {
            thisMonth: number;
            lastMonth: number;
            allTime: number;
            monthOverMonth: string | null;
        };
        distribution: {
            groupsByModality: {
                modality: import("@prisma/client").$Enums.ClassModality;
                count: number;
            }[];
            groupsByRhythm: {
                rhythm: import("@prisma/client").$Enums.StudyRhythm | null;
                count: number;
            }[];
            enrollmentsByPlan: {
                plan: string;
                count: number;
            }[];
            paymentsByMethod: {
                method: string | null;
                count: number;
                total: number;
            }[];
        };
        occupancy: {
            id: string;
            name: string;
            levelCode: string;
            modality: import("@prisma/client").$Enums.ClassModality;
            current: number;
            max: number;
            pct: number;
        }[];
        recent: {
            payments: ({
                enrollment: {
                    user: {
                        firstName: string | null;
                        lastName: string | null;
                    };
                    level: {
                        name: string;
                    };
                } & {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    levelId: string;
                    userId: string;
                    planType: string;
                    monthlyFee: number;
                    startDate: Date;
                    endDate: Date | null;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.PaymentStatus;
                method: string | null;
                enrollmentId: string;
                amount: number;
                paidAt: Date | null;
                reference: string | null;
            })[];
            leads: {
                id: string;
                email: string | null;
                phone: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                source: import("@prisma/client").$Enums.LeadSource;
                sourceDetail: string | null;
                status: import("@prisma/client").$Enums.LeadStatus;
                notes: string | null;
                interestedIn: string | null;
                assignedTo: string | null;
                convertedToUserId: string | null;
                trialClassDate: Date | null;
            }[];
        };
        adBudgets: {
            google: any;
            meta: any;
            total: any;
        };
    }>;
}
