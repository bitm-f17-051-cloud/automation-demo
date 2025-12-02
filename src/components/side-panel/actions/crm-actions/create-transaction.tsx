/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input";
import { DynamicInput } from "@/components/ui/dynamic-input";
import PrimaryButton from "@/components/ui/primary-button";
import { Separator } from "@/components/ui/separator";
import { useWorkflowStore } from "@/store/workflow.store";
import { ChevronRight, XIcon, Globe, Info } from "lucide-react";
import { useState } from "react";

type Props = {
  goBack: () => void;
  nodeData: { [key: string]: any } | undefined;
};

const CreateTransactionAction = ({ goBack, nodeData }: Props) => {
  const { selectedNodeId, updateNodeConfig } = useWorkflowStore();

  const [actionName, setActionName] = useState(nodeData?.nodeName || "Create a New Transaction");
  const [contactEmail, setContactEmail] = useState(nodeData?.nodeData?.contactEmail || "");
  const [contactFirstName, setContactFirstName] = useState(nodeData?.nodeData?.contactFirstName || "");
  const [contactLastName, setContactLastName] = useState(nodeData?.nodeData?.contactLastName || "");
  const [contactPhoneNumber, setContactPhoneNumber] = useState(nodeData?.nodeData?.contactPhoneNumber || "");
  const [transactionTime, setTransactionTime] = useState(nodeData?.nodeData?.transactionTime || "");
  const [transactionValue, setTransactionValue] = useState(nodeData?.nodeData?.transactionValue || "");
  const [productName, setProductName] = useState(nodeData?.nodeData?.productName || "");

  const saveAction = () => {
    if (!selectedNodeId) return;

    const config = {
      nodeType: "crm_create_transaction",
      nodeName: actionName,
      nodeIcon: "deal",
      nodeDescription: `Create transaction: ${contactEmail} - ${transactionValue}`,
      nodeData: {
        contactEmail,
        contactFirstName,
        contactLastName,
        contactPhoneNumber,
        transactionTime,
        transactionValue,
        productName,
      },
      properties: [
        { key: "Contact Email", value: contactEmail },
        ...(contactFirstName ? [{ key: "Contact First Name", value: contactFirstName }] : []),
        ...(contactLastName ? [{ key: "Contact Last Name", value: contactLastName }] : []),
        ...(contactPhoneNumber ? [{ key: "Contact Phone Number", value: contactPhoneNumber }] : []),
        ...(transactionTime ? [{ key: "Transaction Time", value: transactionTime }] : []),
        { key: "Transaction Value", value: transactionValue },
        ...(productName ? [{ key: "Product Name", value: productName }] : []),
      ],
    };

    updateNodeConfig(selectedNodeId, config, !nodeData);
    goBack();
  };

  const isValid = contactEmail && transactionValue;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Create a New Transaction</h2>
          <button
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Creates a new transaction in iClosed.</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Action Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Action Name</label>
            <Input
              placeholder="Enter action name"
              className="h-10 text-sm"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
            />
          </div>

          <Separator />

          {/* Contact Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact Email
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter contact email"
              value={contactEmail}
              onChange={setContactEmail}
            />
          </div>

          {/* Contact First Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact First Name
            </label>
            <DynamicInput
              placeholder="Enter contact first name"
              value={contactFirstName}
              onChange={setContactFirstName}
            />
          </div>

          {/* Contact Last Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact Last Name
            </label>
            <DynamicInput
              placeholder="Enter contact last name"
              value={contactLastName}
              onChange={setContactLastName}
            />
          </div>

          {/* Contact Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Contact Phone Number
            </label>
            <DynamicInput
              placeholder="Enter contact phone number"
              value={contactPhoneNumber}
              onChange={setContactPhoneNumber}
            />
          </div>

          {/* Transaction Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Transaction Time
            </label>
            <DynamicInput
              placeholder="Enter transaction time"
              value={transactionTime}
              onChange={setTransactionTime}
            />
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Time zone: Asia/Karachi</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  For more information about supported date formats, see the{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    online Help
                  </a>
                  .
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Value */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Transaction Value
              <span className="text-red-500">*</span>
            </label>
            <DynamicInput
              placeholder="Enter transaction value"
              value={transactionValue}
              onChange={setTransactionValue}
            />
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              Product Name
            </label>
            <DynamicInput
              placeholder="Enter product name"
              value={productName}
              onChange={setProductName}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <PrimaryButton onClick={goBack} isPrimary={false}>
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={saveAction} isPrimary={true} disabled={!isValid}>
          Save Action
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CreateTransactionAction;

