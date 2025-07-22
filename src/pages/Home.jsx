import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Header from "../components/Header";
import Group from "../components/Group";
import AddGroup from "../components/AddGroup";

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.groupIds && user.groupIds.length > 0) {
        const fetched = await Promise.all(
          user.groupIds.map(async (groupId) => {
            const groupRef = doc(db, "groups", groupId);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
              return { id: groupSnap.id, ...groupSnap.data() };
            } else {
              return null;
            }
          })
        );

        const filtered = fetched.filter((g) => g !== null);
        setGroups(filtered);
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-10 px-5">
        <h1 className="text-3xl font-bold mb-4 uppercase">
          Salom, {user?.name} {user?.surname}!
        </h1>

        {groups.length > 0 ? (
          <div className="list-disc  space-y-4">
            <h2 className="text-xl font-semibold mb-2">
              Siz a'zo bo‘lgan guruhlar
            </h2>
            {groups.map((group) => (
              <Group key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <p>Hech qanday guruhga a’zo emassiz. </p>
        )}

        <div className="flex items-center justify-center mt-10">
          <AddGroup />
        </div>
      </div>
    </div>
  );
}
