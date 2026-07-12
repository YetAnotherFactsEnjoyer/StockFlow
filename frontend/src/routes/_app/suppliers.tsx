import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/suppliers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/suppliers"!</div>
}
