import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

export default function Group({ group }) {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      if (!group?.members) return;

      const fetched = await Promise.all(
        group.members.map(async (userId) => {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            return `${data.name} ${data.surname}`;
          } else {
            return "Noma’lum foydalanuvchi";
          }
        })
      );

      setMembers(fetched);
    };

    fetchMembers();
  }, [group]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase">
          Guruhingiz nomi: {group.name}
        </CardTitle>
        <CardDescription>Ma'lumot: {group.description}</CardDescription>
        <CardAction>Jami a'zolar soni: {group.totalMembers}</CardAction>
      </CardHeader>

      <CardContent>
        <p>Sizning bu navbatdagi hissangiz: {group.contributionAmount} so'm</p>
      </CardContent>

      <CardFooter>
        <p>
          Umumiy yig'iladigan pullar:{" "}
          {group.totalMembers * group.contributionAmount} so'm
        </p>
      </CardFooter>
      <CardFooter>
        <strong>A'zolar ro'yxati ko'rish uchun bosing 👉 </strong>
        <div className=" flex items-center gap-2 flex-wrap">
          {members.length > 0 ? (
            <Link
              to="/members"
              state={{ members: group.members }}
              className="text-xl text-blue-600 hover:underline"
            >
              A'zolar
            </Link>
          ) : (
            <p>Yuklanmoqda...</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
