import TitleHead from "@/components/heads/TitleHead";
import NotificationLists from "@/components/lists/NotificationLists";

export default function Notifications() {
  return (
    <>
      <TitleHead title="Notifications" disableBackButton />
      <NotificationLists />
    </>
  );
}
