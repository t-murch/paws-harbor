import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pricing } from "@/../../api/src/types/pricing";

export default function Pricelist({
  bathing: bathingPrices,
  sitting: sittingPrices,
  subscription: subscriptionPrices,
  walking: walkingPrices,
}: Pricing) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <Card className="w-full justify-center">
        <CardHeader>
          <CardTitle className="text-center text-2xl md:text-3xl">
            Our Services
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            <h1 className="text-center text-2xl md:text-3xl font-bold">
              Pet Services Pricing
            </h1>

            <Tabs defaultValue="alacarte" className="w-full">
              <div className="flex justify-center">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="alacarte">A-la-carte</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="alacarte" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="overflow-hidden">
                    <CardHeader className="space-y-1">
                      <CardTitle>Pet Sitting & Walking</CardTitle>
                      <CardDescription>Time-based pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Service
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Base Price
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Additional
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Pet Sitting
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              ${sittingPrices.basePrice} /{" "}
                              {sittingPrices.baseTime}hrs
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              ${sittingPrices.additionalPrice} /{" "}
                              {sittingPrices.additionalTime}hr
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="whitespace-nowrap">
                              Pet Walking
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              ${walkingPrices.basePrice} /{" "}
                              {walkingPrices.baseTime}min
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              ${walkingPrices.additionalPrice} /{" "}
                              {walkingPrices.additionalTime}min
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Overnight Fee</TableCell>
                            <TableCell>${sittingPrices.overnightFee}</TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Weekend Fee</TableCell>
                            <TableCell>${sittingPrices.weekendFee}</TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader className="space-y-1">
                      <CardTitle>Pet Bathing</CardTitle>
                      <CardDescription>
                        Size/weight-based pricing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Pet Size
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Price
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Small</TableCell>
                            <TableCell>${bathingPrices.small}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Medium</TableCell>
                            <TableCell>${bathingPrices.medium}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Large</TableCell>
                            <TableCell>${bathingPrices.large}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="mt-6">
                <Card className="overflow-hidden">
                  <CardHeader className="space-y-1">
                    <CardTitle>Subscription Options</CardTitle>
                    <CardDescription>
                      Regular service at a discounted rate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Plan
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Price
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Daily</TableCell>
                          <TableCell>
                            ${subscriptionPrices.daily} / day
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Weekly</TableCell>
                          <TableCell>
                            ${subscriptionPrices.weekly} / week
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Monthly</TableCell>
                          <TableCell>
                            ${subscriptionPrices.monthly} / month
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <br />
          <p className="text-center text-sm text-muted-foreground mt-8">
            All services are available to dogs or cats in or within 5 miles of
            Gig Harbor, WA.{" "}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
