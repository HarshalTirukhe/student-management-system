import prisma from "../lib/prisma.js";

export const getAllStudents = () => {
    return prisma.student.findMany({
        include: {
            course: true,
        },
        orderBy: {
            id: "asc",
        },
    });
};

export const getStudentById = (id: number) => {
    return prisma.student.findUnique({
        where: {
            id,
        },
        include: {
            course: true,
        },
    });
};

export const createStudent = (
    name: string,
    age: number,
    email: string,
    courseId: number
) => {
    return prisma.student.create({
        data: {
            name,
            age,
            email,
            course: {
                connect: {
                    id: courseId,
                },
            },
        },
        include: {
            course: true,
        },
    });
};

export const updateStudent = (
    id: number,
    name: string,
    age: number,
    email: string,
    courseId: number
) => {
    return prisma.student.update({
        where: {
            id,
        },
        data: {
            name,
            age,
            email,
            course: {
                connect: {
                    id: courseId,
                },
            },
        },
        include: {
            course: true,
        },
    });
};

export const deleteStudent = (id: number) => {
    return prisma.student.delete({
        where: {
            id,
        },
    });
};