import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Chart from "../components/Chart";
import { toast } from "sonner";

export default function Statistics() {
  const user = useSelector((state) => state.user.user);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const groupRef = doc(db, "groups", user.groupIds[0]);
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) return;

      const groupData = groupSnap.data();
      const memberIds = groupData.members;
      const contributionAmount = groupData.contributionAmount;
      if (!Array.isArray(memberIds) || memberIds.length === 0) {
        toast.error("Guruhda a'zo mavjud emas.");
        return;
      }
      const data = await Promise.all(
        memberIds.map(async (id) => {
          const userRef = doc(db, "users", id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            return {
              name: userData.name,
              total: contributionAmount,
            };
          } else {
            return { name: "Noma'lum", total: 0 };
          }
        })
      );

      setMembers(data);
    };

    fetchMembers();
  }, [user.groupId]);

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-10 px-5">
        <h1 className="text-3xl font-bold mb-4">Statistika</h1>
        {members.length > 0 ? (
          <Chart members={members} />
        ) : (
          <p>Yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
}
