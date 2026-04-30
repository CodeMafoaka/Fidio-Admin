"use client"

export default function SimpleTest() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard Test</h1>
            <p>Si vous voyez cette page, le problème vient du dashboard complexe.</p>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p>✅ Page chargée avec succès</p>
            </div>
        </div>
    )
}
