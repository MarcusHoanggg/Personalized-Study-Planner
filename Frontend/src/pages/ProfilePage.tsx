
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
    <div className="space-y-8">

      {/* HEADER */}
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account information"
      />

      {/* PROFILE CARD */}
      <Card className="rounded-3xl border border-purple-100 shadow-sm p-6">

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <Avatar name={user.username} size="lg" />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border border-purple-200 text-lg">
              📷
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-purple-700">
              {user.username}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-1 text-sm text-gray-600">Name</label>
            <Input
              value={user.username}
              disabled
              className="bg-purple-50/40 border-purple-200"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <Input
              value={user.email}
              disabled
              className="bg-purple-50/40 border-purple-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Bio</label>
            <Input
              placeholder="Tell us about yourself..."
              className="bg-purple-50/40 border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>
      </Card>

      {/* ACCOUNT STATS */}
      <Card className="rounded-3xl border border-purple-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">
          Account Statistics
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <StatsCard label="Tasks Created" value={0} color="purple" />
          <StatsCard label="Tasks Completed" value={0} color="green" />
          <StatsCard label="Tasks Shared" value={0} color="blue" />
        </div>
      </Card>

      {/* PREFERENCES */}
      <Card className="rounded-3xl border border-purple-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">
          Preferences
        </h3>

        <div className="space-y-6">

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive email reminders for tasks
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-100"
            >
              Configure
            </Button>
          </div>

          {/* Calendar Integration */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Calendar Integration</p>
              <p className="text-sm text-gray-500">
                Sync with Google Calendar
              </p>
            </div>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-100"
            >
              Connect
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
