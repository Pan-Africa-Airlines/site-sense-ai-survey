
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConfigField {
  name: string;
  type: string;
  value: string | boolean;
}

interface ConfigFieldCardProps {
  title: string;
  description: string;
  fields: ConfigField[];
}

const ConfigFieldCard: React.FC<ConfigFieldCardProps> = ({
  title,
  description,
  fields
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex justify-between items-center">
              <Label htmlFor={`field-${index}`} className="flex-1">
                {field.name}
              </Label>
              {field.type === 'checkbox' ? (
                <Switch
                  id={`field-${index}`}
                  checked={field.value as boolean}
                  disabled
                />
              ) : (
                <Input
                  id={`field-${index}`}
                  type={field.type}
                  value={field.value as string}
                  className="w-1/2"
                  readOnly
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigFieldCard;
