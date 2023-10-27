import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body = await req.json();

		const { name } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated.', { status: 401 });
		}

		if (!name) {
			return new NextResponse(
				'You must provide a name when updating a store name.',
				{ status: 400 }
			);
		}

		if (!params.storeId) {
			return new NextResponse(
				'Store id is required when updating a store.',
				{
					status: 400,
				}
			);
		}

		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log({ STORE_PATCH: error });
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated.', { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse(
				'Store id is required when deleting a store.',
				{
					status: 400,
				}
			);
		}

		const store = await prismadb.store.delete({
			where: {
				userId,
				id: params.storeId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log({ STORE_DELETE: error });
		return new NextResponse('Internal error', { status: 500 });
	}
}
