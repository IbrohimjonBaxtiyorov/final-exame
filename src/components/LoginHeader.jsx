import logo from "../assets/gapclub.png"
export default function LoginHeader() {
  return (
    <header className="container mx-auto py-[30px] flex items-center gap-5">
        <img src={logo} alt=""  width={30} />
        <h2 className=" font-bold text-2xl">Gap Club</h2>
    </header>
  )
}
