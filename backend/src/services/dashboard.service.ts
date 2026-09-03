import prisma from "../lib/prisma.js";

export const getDashboardStats = async () => {
  const [
    totalStudents,
    totalCourses,
    totalUsers,
    recentStudents,
  ] = await Promise.all([
    prisma.student.count(),

    prisma.course.count(),

    prisma.user.count(),

    prisma.student.findMany({
      include: {
        course: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    totalStudents,
    totalCourses,
    totalUsers,
    recentStudents,
  };
};