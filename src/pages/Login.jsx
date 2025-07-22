import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginHeader from "../components/LoginHeader";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { setUser } from "../lib/redux-tollkit/slices/gap-club-slices";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export function Login() {
  const [form, setForm] = useState({ name: "", groupId: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, groupId } = form;

    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        toast.error("Bunday guruh mavjud emas!");
        return;
      }

      const userId = uuidv4();

      const newUser = {
        name,
        groupIds: [groupId],
        createdAt: new Date().toString(),
      };

      await setDoc(doc(db, "users", userId), newUser);

      await updateDoc(groupRef, {
        members: arrayUnion(userId),
        totalMembers: groupSnap.data().totalMembers + 1,
      });

      dispatch(setUser({ id: userId, ...newUser }));
      localStorage.setItem("user", JSON.stringify({ id: userId, ...newUser }));
      toast.success("Guruhga muvaffaqiyatli qo‘shildingiz!");
      navigate("/");
    } catch (error) {
      toast.error("Kirishda xatolik yuz berdi.");
    }
  };

  return (
    <div>
      <LoginHeader />
      <div className="flex items-center justify-center mt-20 flex-col">
        <h2 className=" font-bold text-3xl">
          Guruhga Qo‘shilish
        </h2>
        <p className="">
          Ismingizni kiriting va mavjud guruhga qo‘shiling
        </p>
        <Card className="w-full max-w-sm mt-5">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ismingiz</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="groupId">Guruh ID</Label>
                  <Input
                    id="groupId"
                    type="text"
                    placeholder="Guruh ID kiriting"
                    required
                    value={form.groupId}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-5">
                Guruhga qo‘shilish
              </Button>
            </form>
            <Link
              to="/register"
              className="block text-center text-sm text-blue-600 hover:underline mt-4"
            >
              Hisobingiz yo'qmi? Ro‘yxatdan o‘ting
            </Link>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </div>
  );
}
