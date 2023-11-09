import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Server-side error" },
    { name: "description", content: "Testing the handleError function on server.entry.tsx" },
  ];
};

export async function loader({ request, params: _params }: LoaderFunctionArgs) {
  throw new Error('This should be shown in production on the server-side')
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
       This route should throw a server-side error from the loader
    </div>
  );
}
