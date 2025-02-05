"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@risc0/ui/breadcrumb";
import { useLocalStorage } from "@risc0/ui/hooks/use-local-storage";
import { useMounted } from "@risc0/ui/hooks/use-mounted";
import compact from "lodash-es/compact";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Fragment } from "react";
import { joinWords } from "shared/utils/join-words";

// Routes you don't want to show up in the breadcrumb
const HIDDEN_BREADCRUMB_ROUTES = ["applications-benchmarks"];

export function Breadcrumbs() {
  const pathname = usePathname();
  const { version } = useParams();
  const paths = compact(pathname.split("/"));
  const mounted = useMounted();
  const [versionLocalStorage] = useLocalStorage<string | undefined>("version", undefined);

  if (version) {
    paths.shift(); // remove version number from URL
  }

  if (pathname === "/" || paths.length === 0) {
    // non-breaking space to keep alignment
    return <>&nbsp;</>;
  }

  return (
    <>
      {/* non-breaking space to keep alignment */}
      <div className="block md:hidden">&nbsp;</div>

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={mounted ? `/${version ?? versionLocalStorage ?? ""}` : "/"}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          {paths
            .filter((path) => !HIDDEN_BREADCRUMB_ROUTES.includes(path))
            .map((path, index, { length }) => {
              const isLast = length - 1 === index;
              const sanitizedChunk = joinWords(path);

              return (
                <Fragment key={path}>
                  {isLast ? (
                    <BreadcrumbPage className="capitalize">{sanitizedChunk}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link className="capitalize" href={`/${version}/${path}`}>
                          {sanitizedChunk}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                  {length - 1 !== index && (
                    <BreadcrumbSeparator>
                      <ChevronRightIcon />
                    </BreadcrumbSeparator>
                  )}
                </Fragment>
              );
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
