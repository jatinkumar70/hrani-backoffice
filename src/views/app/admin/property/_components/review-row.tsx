// import { useState } from "react";
// import { Trash } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { TableCell, TableRow } from "@/components/ui/table";
// import { Avatar } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// // ========================================================================
// interface Review {
//   customer: string;
//   product: string;
//   comment: string;
//   published: boolean;
//   productImage: string;
// }

// type Props = { review: Review };
// // ========================================================================

// export default function ReviewRow({ review }: Props) {
//   const { customer, product, comment, published, productImage } = review || {};

//   const [productPublish, setProductPublish] = useState(published);

//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-4">
//           <Avatar className="rounded-md h-10 w-10">
//             <img src={productImage} alt={product} className="object-cover" />
//           </Avatar>
//           <span className="font-medium">{product}</span>
//         </div>
//       </TableCell>

//       <TableCell>{customer}</TableCell>

//       <TableCell>
//         <span className="text-sm text-muted-foreground">{comment}</span>
//       </TableCell>

//       <TableCell>
//         <Switch
//           checked={productPublish}
//           onCheckedChange={(checked) => setProductPublish(checked)}
//         />
//       </TableCell>

//       <TableCell className="text-center">
//         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
//           <Trash className="h-4 w-4" />
//         </Button>
//       </TableCell>
//     </TableRow>
//   );
// }
