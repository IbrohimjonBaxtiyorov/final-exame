import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logo from "../assets/gapclub.png";
export default function Members() {
  const location = useLocation();
  const memberIds = location.state?.members || [];
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await Promise.all(
        memberIds.map(async (id) => {
          const userRef = doc(db, "users", id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            return userSnap.data();
          }
          return { name: "Noma’lum", surname: "foydalanuvchi" };
        })
      );
      setUsers(data);
    };
    fetch();
  }, [memberIds]);

  return (
    <div>
      <Header />
      <div className="container mx-auto px-5 ">
        <div className="flex items-center justify-between py-10">
          <h2>A'zolar</h2>
          <Button>A'zo qo'shish</Button>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {users ? (
            users.map(({ name, createdAt },index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="uppercase">{name}</CardTitle>
                    <CardDescription>
                      Guruxingizga qo'shilgan kun : {createdAt}{" "}
                    </CardDescription>
                    <CardAction>
                      <img src={logo} alt="" width={200} />
                    </CardAction>
                  </CardHeader>
                </Card>
              );
            })
          ) : (
            <h1>Hali a'zolar mavjud emas</h1>
          )}
        </div>
      </div>
    </div>
  );
}
