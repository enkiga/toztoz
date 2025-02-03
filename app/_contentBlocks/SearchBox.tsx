import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SearchIcon } from "lucide-react";
import { useStore } from "@/app/_store/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDebounce } from "@/app/_hooks/useDebounce";

const SearchBox = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { searchProducts } = useStore();

  // Fetch Products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", debouncedSearchTerm],
    queryFn: () => searchProducts(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
  });
  return (
    <>
      <SearchIcon size={16} onClick={() => setIsOpen(true)} />

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle aria-describedby="search-title"></DialogTitle>
        </DialogHeader>
        <CommandInput
          placeholder="Type to search..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          {isLoading && <div className="p-2 text-sm">Searching...</div>}
          <CommandEmpty>
            {isError
              ? "Error searching products"
              : debouncedSearchTerm.length < 2
              ? "Type at least 2 characters"
              : "No products found"}
          </CommandEmpty>
          {!isLoading && data && data.length > 0 && (
            <CommandGroup heading="Products">
              {data.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.productName}
                  onSelect={() => {
                    window.location.href = `/${product.category[0]?.categorySlug}/${product.productSlug}`;
                  }}
                >
                  <div className="flex items-center gap-4">
                    {product.productImage[0]?.url && (
                      <img
                        src={product.productImage[0].url}
                        alt={product.productName}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.productName}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBox;
