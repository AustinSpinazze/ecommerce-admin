'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useStoreModal } from '@/hooks/use-store-modal';
import { Modal } from '@/components/ui/modal';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
	name: z.string().min(3, 'Store name must be at least 3 characters long.'),
});

export const StoreModal = () => {
	const storeModal = useStoreModal();

	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setLoading(true);

			const response = await axios.post('/api/stores', values);

			const { id } = response.data;

			window.location.assign(`/${id}`);
		} catch (error) {
			toast.error('Oops there was problem creating your store 🙃');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title='Create store'
			description='Add a new store to manage products and categories'
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder='Enter store name (ex. Cosmic Commodities)'
												{...field}
											/>
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}
							/>
							<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
								<Button disabled={loading} type='submit'>
									Continue
								</Button>
								<Button
									disabled={loading}
									variant='outline'
									onClick={storeModal.onClose}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	);
};
