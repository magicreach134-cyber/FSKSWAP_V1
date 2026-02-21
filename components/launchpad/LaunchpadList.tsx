"use client";

import { Card, Button } from "@/components/ui";

export default function LaunchpadList() {
  const dummyProjects = [
    {
      name: "FSK Presale",
      softCap: "100 BNB",
      hardCap: "500 BNB",
      progress: 40,
    },
  ];

  return (
    <Card className="p-6 space-y-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold">
        Launchpad
      </h2>

      {dummyProjects.map((project) => (
        <div key={project.name} className="space-y-2">
          <div className="font-medium">
            {project.name}
          </div>
          <div className="text-sm">
            {project.softCap} / {project.hardCap}
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <Button fullWidth size="sm">
            Participate
          </Button>
        </div>
      ))}
    </Card>
  );
}
