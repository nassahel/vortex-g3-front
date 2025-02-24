import UserNavbar from '../../components/UserNavbar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserNavbar />
      <main className='flex items-center justify-center h-[calc(100vh-4rem)]'>{children}</main>
    </div>
  );
}
