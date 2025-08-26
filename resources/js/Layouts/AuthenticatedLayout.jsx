import React from 'react';
import { Head } from '@inertiajs/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AuthenticatedLayout({ user, header, children }) {
    return (
        <Provider store={store}>
            <div className="flex h-screen bg-gray-100">
                <Sidebar user={user} />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={user} header={header} />

                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </Provider>
    );
}
