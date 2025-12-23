import OrganizationInfo from "@/components/OrganizationInfo";



export default async function page({ params, }: { params: Promise<{ id: string , slug: string }> } ) {

  const { id, slug } = await params;
  

  return (<OrganizationInfo id={id} slug={slug} />);
}