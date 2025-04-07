
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactDetail {
  name: string;
  cellphone: string;
  email: string;
}

interface SiteContactDetailsProps {
  formData: {
    siteContacts: ContactDetail[];
    [key: string]: any;
  };
  onInputChange: (field: string, value: any) => void;
}

const SiteContactDetails: React.FC<SiteContactDetailsProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">1.5 Eskom site owner contact details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-4 border-b pb-2">
            <div className="col-span-3 font-semibold">Contact name</div>
            <div className="col-span-2 font-semibold">Cellphone number</div>
            <div className="col-span-2 font-semibold">Email address</div>
          </div>
          
          {formData.siteContacts.map((contact: ContactDetail, index: number) => (
            <div key={index} className="grid grid-cols-7 gap-4 border-b pb-4">
              <div className="col-span-3">
                <Input
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...formData.siteContacts];
                    newContacts[index] = { ...contact, name: e.target.value };
                    onInputChange("siteContacts", newContacts);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={contact.cellphone}
                  onChange={(e) => {
                    const newContacts = [...formData.siteContacts];
                    newContacts[index] = { ...contact, cellphone: e.target.value };
                    onInputChange("siteContacts", newContacts);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...formData.siteContacts];
                    newContacts[index] = { ...contact, email: e.target.value };
                    onInputChange("siteContacts", newContacts);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteContactDetails;
