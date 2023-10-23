import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!name) {
			return new NextResponse(
				'You must provide a name when creating a new store.',
				{ status: 400 }
			);
		}

		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log({ STORES_POST: error });
		return new NextResponse('Internal error', { status: 500 });
	}
}