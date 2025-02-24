"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/app/_store/store";
import { useQuery } from "@tanstack/react-query";
import markdownit from "markdown-it";

interface Document {
  title: string;
  content: string;
  docSlug: string;
}

const Document = () => {
  const { getDocuments, getDocumentBySlug } = useStore();

  const params = useParams<{ docSlug: string }>();
  const docSlug = params.docSlug;

  // Fetch Documents
  const { data: docData } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const doc = docData?.find((doc) => doc.docSlug === docSlug);

  // Fetch Document by Slug
  const { data, isLoading } = useQuery<Document>({
    queryKey: ["document", docSlug],
    queryFn: () => getDocumentBySlug(docSlug),
  });

  const md = new markdownit();
  let context = data?md.render(data.content):"";

   // Function to replace <a> tags with <Link> components
   const replaceLinks = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const links = tempDiv.querySelectorAll('a');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) { // Check if it's an internal link
        const nextLink = document.createElement('span');
        nextLink.innerHTML = `<a href="${href}">${link.innerHTML}</a>`;
        link.replaceWith(nextLink);
      }
    });

    return tempDiv.innerHTML;
  };

  if (typeof window !== 'undefined' && context){
    context = replaceLinks(context);
  }

  return (
    <div className="w-full min-h-screen pt-20">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-11/12 mx-auto">
          <h1 className="font-semibold text-3xl text-center underline">{data?.title}</h1>
          <div className="my-4" dangerouslySetInnerHTML={{ __html: context }}/>
        </div>
      )}
    </div>
  );
};

export default Document;
