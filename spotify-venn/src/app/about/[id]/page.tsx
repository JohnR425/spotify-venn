'use client'
import { useParams } from 'next/navigation';

//Testing dynamic routing
export default function Home() {
    const params = useParams();
    const id = params.id;
    return (
        <div>
            <h1>ID = {id}</h1>
        </div>
    );
};