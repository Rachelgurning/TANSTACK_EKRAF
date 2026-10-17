import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
interface MyRouterContext { queryClient: QueryClient }
export const Route = createRootRouteWithContext<MyRouterContext>()({head:()=>({meta:[{charSet:"utf-8"},{name:"viewport",content:"width=device-width, initial-scale=1"},{title:"OnanAI — Pasar kreatif Samosir"},{name:"description",content:"Temukan produk UMKM Samosir dan bantu usaha lokal tumbuh dengan AI."}],links:[{rel:"stylesheet",href:appCss}]}),shellComponent:RootDocument});
function RootDocument({children}:{children:React.ReactNode}){return <html lang="id" suppressHydrationWarning><head><HeadContent/></head><body><Header/>{children}<Footer/><TanStackDevtools config={{position:"bottom-right"}} plugins={[{name:"TanStack Router",render:<TanStackRouterDevtoolsPanel/>},TanStackQueryDevtools]}/><Scripts/></body></html>}
