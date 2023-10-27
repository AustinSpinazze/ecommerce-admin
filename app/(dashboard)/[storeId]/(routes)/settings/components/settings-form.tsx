'use client';

import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingsFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z.string().min(3, 'Store name must be at least 3 characters long.'),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const origin = useOrigin();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const onSubmit = async (data: SettingsFormValues) => {
		if (data.name === initialData.name) {
			toast.error('Name unchanged. Please update to save 🤔');
			return;
		}

		try {
			setLoading(true);
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
			toast.success('Store name updated 🚀');
		} catch (error: any) {
			toast.error('Oops there was a problem updating your store name 😢');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/stores/${params.storeId}`);
			router.refresh();
			router.push('/');
			toast.success('Store was successfully deleted ✅');
		} catch (error) {
			console.log(error);
			toast.error(
				'Make sure you removed all active product and categories first.'
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className='flex items-center justify-between'>
				<Heading
					title='Settings'
					description='Manage store preferences'
				/>
				<Button
					disabled={loading}
					className='cursor-pointer'
					variant='destructive'
					size='sm'
					onClick={() => {
						setOpen(true);
					}}
				>
					<Trash className='h-4 w-4 mr-2' />
					Delete Store
				</Button>
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'
				>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Update Store Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Enter store name (ex. Cosmic Commodities)'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={loading}
						className='ml-auto'
						type='submit'
					>
						Update Name
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title='NEXT_PUBLIC_API_URL'
				description={`${origin}/api/${params.storeId}`}
				variant='public'
			/>
		</>
	);
};
