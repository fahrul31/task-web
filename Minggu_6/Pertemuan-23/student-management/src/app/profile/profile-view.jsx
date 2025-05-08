export default function ProfileView({ userData }) {
    const profileFields = [
        { label: "ID", value: userData.id },
        { label: "Email", value: userData.email },
        { label: "Name", value: userData.name },
        { label: "Role", value: userData.role },
    ]

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-6">
                    <div className="space-y-4">
                        {profileFields.map((field, index) => (
                            <div key={field.label}>
                                <div className="flex justify-between py-2">
                                    <span className="font-medium text-gray-500">{field.label}</span>
                                    <span className="font-semibold">{field.value}</span>
                                </div>
                                {index < profileFields.length - 1 && <div className="h-px bg-gray-200 my-2"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
