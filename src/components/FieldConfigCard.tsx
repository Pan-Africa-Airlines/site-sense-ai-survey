
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, MoveUp, MoveDown } from "lucide-react";
import type { FormField } from "./FormFieldsConfiguration";

interface FieldConfigCardProps {
  field: FormField;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const FieldConfigCard: React.FC<FieldConfigCardProps> = ({
  field,
  onDelete,
  onMoveUp,
  onMoveDown,
  onEdit,
  isFirst,
  isLast
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{field.label}</h4>
              {field.required && <Badge variant="outline">Required</Badge>}
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Type: <span className="font-medium capitalize">{field.type}</span></p>
              {field.placeholder && <p>Placeholder: "{field.placeholder}"</p>}
              
              {field.type === "select" && field.options && field.options.length > 0 && (
                <div>
                  <p>Options:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {field.options.map((option, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMoveUp}
              disabled={isFirst}
              className="h-8 w-8"
            >
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMoveDown}
              disabled={isLast}
              className="h-8 w-8"
            >
              <MoveDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldConfigCard;
