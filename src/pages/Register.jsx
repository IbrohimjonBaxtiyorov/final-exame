import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginHeader from "../components/LoginHeader";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { setUser } from "../lib/redux-tollkit/slices/gap-club-slices";
import { db } from "../firebase/config";
import { toast } from "sonner";

export default function Register() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    groupId: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = uuidv4();

    try {
      const userData = {
        name: form.name,
        surname: form.surname,
        createdAt: new Date().toString(),
      };

      await setDoc(doc(db, "users", userId), userData);
      dispatch(setUser({ id: userId, ...userData }));
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div>
      <LoginHeader />
      <div className="flex items-center justify-center mt-20 flex-col">
        <h2 className="font-bold text-3xl ">Ro'yxatdan o'tish</h2>
        <p>Yangi guruhga qo'shilish yoki o'z guruhingizni yarating</p>
        <Card className="w-full max-w-sm mt-5">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ismingiz</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    placeholder="Ismingizni kiriting"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Familiya</Label>
                  <Input
                    id="surname"
                    type="text"
                    required
                    placeholder="Familiyangizni kiriting"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-5">
                Ro'yxatdan o'tish
              </Button>
            </form>
            <Link
              to="/login"
              className="block text-center text-sm text-blue-600 hover:underline mt-4"
            >
              Hisobingiz bormi? Kirish sahifasiga o‘ting
            </Link>
          </CardContent>
          <CardFooter className="flex-col gap-2"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
