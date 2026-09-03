import prisma from "../lib/prisma.js";

export const getAllCourses = () => {
  return prisma.course.findMany({
    orderBy: {
      id: "asc",
    },
  });
};