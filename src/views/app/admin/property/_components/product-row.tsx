// import { useNavigate } from "react-router-dom";
// import { Edit, ExternalLink } from "lucide-react";
// import { TableCell, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { IProperty } from "@/models/Property.model";
// import { useAuthContext } from "@/contexts/auth-context/auth-context.hooks";

// const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://bnbmehomes.com";

// const ProductRow = ({ product }: { product: IProperty }) => {
//   const { property_details_uuid, property_details_name, id, property_city, slug, area } = product || {};
//   const { user_info } = useAuthContext();
//   const isAdmin = user_info?.role_value === "ADMIN";
//   const navigate = useNavigate();

//   const handleRedirect = () => {
//     if (isAdmin) {
//       navigate(`/admin/properties/${property_details_uuid}`);
//     } else {
//       navigate(`/property/properties/${property_details_uuid}`);
//     }
//   };

//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <div
//             className="cursor-pointer"
//             onClick={handleRedirect}
//           >
//             <div className="font-medium">{property_details_name}</div>
//             <div className="text-xs text-muted-foreground">#{property_details_uuid}</div>
//           </div>
//           <a
//             href={`${FRONTEND_URL}/property/${slug}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-primary hover:text-primary/80"
//           >
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <ExternalLink className="h-4 w-4" />
//             </Button>
//           </a>
//         </div>
//       </TableCell>

//       <TableCell>{id || "--"}</TableCell>
//       <TableCell>
//         <Badge variant="outline">
//           {product.property_images?.reduce((total, album) => total + (album.paths?.length || 0), 0) || 0}
//         </Badge>
//       </TableCell>
//       <TableCell>{property_city || "--"}</TableCell>
//       <TableCell>{area || "--"}</TableCell>
//       <TableCell className="text-center">
//         <div className="flex justify-center gap-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8"
//             onClick={handleRedirect}
//           >
//             <Edit className="h-4 w-4" />
//           </Button>

//           <a
//             href={`${FRONTEND_URL}/property/${slug}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-primary hover:text-primary/80"
//           >
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <ExternalLink className="h-4 w-4" />
//             </Button>
//           </a>
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// };

// export default ProductRow;
