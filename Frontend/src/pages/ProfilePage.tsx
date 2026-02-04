import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import StatsCard from "../ui/StatsCard";
export default function ProfilePage() {
  const user = {
    username: "mahatomahi2062",
    email: "mahatomahi2062@gmail.com",
    bio: "",
  };

  return (
    
    <div>
      <PageHeader title="Profile Settings" subtitle="Manage your account information" />

      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar name={user.username} size="lg" />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
              📷
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Name</label>
            <Input value={user.username} disabled />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <Input value={user.email} disabled />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Bio</label>
            <Input placeholder="Tell us about yourself..." />
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="mb-4">Account Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatsCard label="Tasks Created" value={0} />
          <StatsCard label="Tasks Completed" value={0} />
          <StatsCard label="Tasks Shared" value={0} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email reminders for tasks</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Calendar Integration</p>
              <p className="text-sm text-gray-500">Sync with Google Calendar</p>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </Card>
    </div>
   
  );
}
