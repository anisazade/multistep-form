import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';

import './globals.css';
import './utilities.css';
import './reset.css';

const ubuntu = Ubuntu({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
    title: 'Subscription App',
    description: 'Subscription app containing a multi-step form',
    icons:{
        icon: '/favicon.png',
    }
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en">
            <body className={`${ubuntu.className}`}>
                {children}
            </body>
        </html>
    );
}
