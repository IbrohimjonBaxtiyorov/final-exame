import { useState } from "react";
import { createGroup } from "../firebase/groupServis";
import { toast } from "sonner";

function CreateGroupForm() {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleCreate = async () => {
    const data = {
      name: groupName,
      createdAt: new Date(),
      members: [],
      rounds: [],
    };

    try {
      await createGroup(groupId, data);
      toast("Guruh yaratildi!");
    } catch (error) {
      toast.error("Xatolik:");
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        type="text"
        placeholder="Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreate}>Guruh yaratish</button>
    </div>
  );
}

export default CreateGroupForm;
