"use server";
import { prisma } from "@/lib/prisma";
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { z } from "zod";
import { Metadata } from '@/lib/Zod';

export async function getUserPlan() {
    try {
        const webHeaders = await headers();
        const session = await auth.api.getSession({ headers: webHeaders });
        if (!session || !session.user) {
            console.warn("[getUserPlan] not signed in");
            throw new Error("You must be signed in");
        }

        const MembersPlan = orgMembersPlan(session.user.id)
        if (MembersPlan) {
            return MembersPlan
        }

    } catch (error) {

    }
}


async function orgMembersPlan(id: string) {
    const memberInOrg = await prisma.member.findFirst({
        where: {
            userId: id,
            role: {
                in: ["member", "admin"]
            }
        },
        select: {
            role: true,
            organization: {
                select: {
                    metadata: true
                }
            }
        }

    })
    if (memberInOrg && memberInOrg.organization.metadata) {
        const plan = Metadata.parse(JSON.parse(memberInOrg.organization.metadata))
        return {
            isEployee: true,
            role: memberInOrg.role,
            value: {
                ...plan,
                limits: {
                    ...plan.limits,
                }
            }
        };
    }
    return null;

}