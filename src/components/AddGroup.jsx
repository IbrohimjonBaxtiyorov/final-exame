import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "../firebase/config";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setUser } from "../lib/redux-tollkit/slices/gap-club-slices";

export default function AddGroup() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    groupId: "",
    groupName: "",
    description: "",
    contributionAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const groupId = form.groupId.trim();

    try {
      const existGr = await getDoc(doc(db, "groups", groupId));
      if (existGr.exists()) {
        toast.error("Bu guruh ID allaqachon mavjud. Boshqa ID tanlang.");
        return;
      }

      const newGroup = {
        name: form.groupName,
        description: form.description,
        contributionAmount: parseFloat(form.contributionAmount),
        createdAt: new Date().toString(),
        totalMembers: 1,
        members: [user?.id],
        creatorName: `${user?.name || ""} ${user?.surname || ""}`.trim(),
        currentRound: 0,
        currentReceiver: null,
        totalContributed: 0,
      };

      await setDoc(doc(db, "groups", groupId), newGroup);

      await updateDoc(doc(db, "users", user.id), {
        groupIds: arrayUnion(groupId),
      });

      dispatch(
        setUser({
          ...user,
          groupIds: [...(user.groupIds || []), groupId],
        })
      );
      toast.success("Guruh muvaffaqiyatli yaratildi!");
      navigate("/");
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Guruh yaratishda xatolik yuz berdi.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Guruh Yaratish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleCreateGroup}>
          <DialogHeader>
            <DialogTitle>Yangi Guruh Yaratish</DialogTitle>
            <DialogDescription>
              Guruh nomi, tavsifi va yig‘im summasini kiriting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="groupId">Guruh ID</Label>
            <Input
              id="groupId"
              name="groupId"
              value={form.groupId}
              onChange={handleChange}
              required
              placeholder="Masalan: Do'stlar1999"
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="groupName">Guruh Nomi</Label>
              <Input
                id="groupName"
                name="groupName"
                value={form.groupName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contributionAmount">Yig‘im (so‘m)</Label>
              <Input
                id="contributionAmount"
                name="contributionAmount"
                type="number"
                value={form.contributionAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Bekor qilish
              </Button>
            </DialogClose>
            <Button type="submit">Yaratish</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
