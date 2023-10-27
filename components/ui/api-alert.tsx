'use client';

import { Copy, ServerIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApiAlertProps {
	title: string;
	description: string;
	variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
	public: 'Public',
	admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive',
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
	title,
	description,
	variant = 'public',
}) => {
	const onCopy = () => {
		navigator.clipboard.writeText(description);
		toast.success('API Route copied to the clipboard.');
	};

	return (
		<Alert>
			<div className='flex items-center gap-x-3'>
				<ServerIcon className='h-4 w-4' />
				<AlertTitle className=''>{title}</AlertTitle>
				<Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
			</div>
			<AlertDescription className='mt-4 flex items-center justify-between'>
				<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
					{description}
				</code>
				<Button variant='outline' size='icon' onClick={onCopy}>
					<Copy className='h-4 w-4' />
				</Button>
			</AlertDescription>
		</Alert>
	);
};