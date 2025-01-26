/* eslint-disable no-unused-vars */
"use client";

import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../../../lib/types";

function BasePricingFormFields({
  form,
  index,
  isEditMode,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  isEditMode: boolean;
}) {
  {
    /* FormField representing the BaseRatePricing interface
     * will be refactored to solo component handling BaseRatePricing
     * and TieredPricing
     */
  }
  return (
    <>
      <div className="grid grid-rows-1 grid-cols-1 md:grid-cols-3 gap-2">
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name={`services.${index}.baseRate`} */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Base Price</FormLabel> */}
        {/*       <FormControl> */}
        {/*         <Input {...field} disabled={!isEditMode} /> */}
        {/*       </FormControl> */}
        {/*       <FormMessage /> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name={`services.${index}.durationOptions.0.durationValue`} */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Duration Value</FormLabel> */}
        {/*       <FormControl> */}
        {/*         <Input {...field} type="number" disabled={!isEditMode} /> */}
        {/*       </FormControl> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name={`services.${index}.durationOptions.0.durationUnit`} */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Duration Unit</FormLabel> */}
        {/*       <FormControl> */}
        {/*         <Input {...field} disabled={!isEditMode} type="number" /> */}
        {/*       </FormControl> */}
        {/*       <FormMessage /> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        {/**/}
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name={`services.${index}.pricingModel.timeUnit`} */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Unit</FormLabel> */}
        {/*       <Select */}
        {/*         defaultValue={field.value} */}
        {/*         disabled={!isEditMode} */}
        {/*         onValueChange={field.onChange} */}
        {/*         {...field} */}
        {/*       > */}
        {/*         <FormControl> */}
        {/*           <SelectTrigger> */}
        {/*             <SelectValue placeholder="hours / days" /> */}
        {/*           </SelectTrigger> */}
        {/*         </FormControl> */}
        {/*         <SelectContent> */}
        {/*           {durationUnit.map((u, idx) => ( */}
        {/*             <SelectItem key={idx} value={u}> */}
        {/*               {u} */}
        {/*             </SelectItem> */}
        {/*           ))} */}
        {/*         </SelectContent> */}
        {/*       </Select> */}
        {/*       <FormMessage /> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name={`services.${index}.pricingModel.additionalTime`} */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Additional Time</FormLabel> */}
        {/*       <FormControl> */}
        {/*         <Input {...field} disabled={!isEditMode} type="number" /> */}
        {/*       </FormControl> */}
        {/*       <FormMessage /> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        {/**/}
        {/* <br /> */}
        {/**/}
        {/* <div className="border rounded-lg p-4"> */}
        {/*   <h3 className="text-lg font-medium mb-4">Add-ons</h3> */}
        {/**/}
        {/*   {/* Existing Addons */}
        {/*   <div className="space-y-3"> */}
        {/*     {Object.entries(addons || {}).map(([key]) => ( */}
        {/*       <div key={key} className="flex gap-3"> */}
        {/*         <div className="grid grid-cols-2 gap-3 flex-1"> */}
        {/*           <FormItem> */}
        {/*             <FormLabel>Add-on Name</FormLabel> */}
        {/*             <Input value={key} disabled className="bg-gray-50" /> */}
        {/*           </FormItem> */}
        {/*           <FormField */}
        {/*             control={form.control} */}
        {/*             name={`services.${index}.pricingModel.addons.${key}`} */}
        {/*             render={({ field }) => ( */}
        {/*               <FormItem> */}
        {/*                 <FormLabel>Price</FormLabel> */}
        {/*                 <FormControl> */}
        {/*                   <Input */}
        {/*                     {...field} */}
        {/*                     type="number" */}
        {/*                     disabled={!isEditMode} */}
        {/*                   /> */}
        {/*                 </FormControl> */}
        {/*               </FormItem> */}
        {/*             )} */}
        {/*           /> */}
        {/*         </div> */}
        {/*         {isEditMode && ( */}
        {/*           <Button */}
        {/*             type="button" */}
        {/*             variant="destructive" */}
        {/*             size="icon" */}
        {/*             className="mt-8" */}
        {/*             onClick={() => removeAddonField(key)} */}
        {/*           /> */}
        {/*         )} */}
        {/*       </div> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </>
  );
}

export default BasePricingFormFields;
