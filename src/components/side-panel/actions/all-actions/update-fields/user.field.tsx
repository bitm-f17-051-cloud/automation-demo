import { ObjectField } from "@/app/api/objects/route";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PrimaryButton from "@/components/ui/primary-button";
import { User, useUsers } from "@/hooks/queries";
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserFieldOptionsProps = {
  field: ObjectField | null;
  selectedOption: User | null;
  setSelectedOption: (option: User) => void;
  userSelectionType: "round_robin" | "select_manually" | undefined;
  setUserSelectionType: (type: "round_robin" | "select_manually") => void;
}

const UserDetails = ({ user, onClick }: { user: User, onClick: () => void }) => {
  return (
    <div className="cursor-pointer flex items-center justify-between w-full" onClick={onClick}>
      <div className="flex items-center gap-1.5">
        {user.signedUrl && <Image height={20} width={20} src={user.signedUrl!} alt={user.firstName} className="w-5 h-5 rounded-full object-cover" />}
        <span className="text-sm font-medium text-gray-900 w-[-webkit-fill-available]">{user.firstName} {user.lastName}</span>
      </div>

      <div className="mr-2 h-5 px-1.5 bg-gray-100 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-900">{user.UserRoles[0].role.name}</div>
    </div>
  )
}

const UserFieldOptions = ({ field, selectedOption, setSelectedOption, userSelectionType, setUserSelectionType }: UserFieldOptionsProps) => {
  const { data: users } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  if (!field) return null;

  return (
    <>
      {userSelectionType !== "select_manually" && <Select value={userSelectionType} onValueChange={(value) => setUserSelectionType(value as "round_robin" | "select_manually")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select User" className="placeholder:text-gray-500 text-gray-900" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="round_robin">Round Robin</SelectItem>
          <SelectItem value="select_manually">Select Manually</SelectItem>
        </SelectContent>
      </Select>}

      {userSelectionType === "select_manually" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <PrimaryButton
              isPrimary={false}
              className={`w-full flex !text-sm items-center justify-between border-input rounded-md ${
                selectedOption ? "!text-muted-foreground" : ""
              }`}
            >
              {selectedOption
                ? <UserDetails user={selectedOption} onClick={() => {}} />
                : "Select"}
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground opacity-50" />
            </PrimaryButton>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[calc(30dvw-32px)] mr-4">
            <div className="p-2">
              <div className="max-h-48 overflow-y-auto flex flex-col gap-4 p-2 pr-0">
                {users?.map((option) => (
                  <UserDetails key={option.id} user={option} onClick={() => { setSelectedOption(option); setIsOpen(false); }} />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default UserFieldOptions;