import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prettyPrint } from "../../../../../api/src/types";
import {
  BaseRatePricing,
  baseServiceFormValues,
  isBaseRatePricing,
  isTieredPricing,
  PersistedServiceConfig,
  Pricing,
} from "@repo/shared/src/server";

export default function Pricelist({
  pricing: {
    bathing: bathingPrices,
    sitting: sittingPrices,
    subscription: subscriptionPrices,
    walking: walkingPrices,
  },
  services,
}: {
  pricing: Pricing;
  services: PersistedServiceConfig[];
}) {
  const baseRateServices: PersistedServiceConfig[] = [],
    tierBasedServices: PersistedServiceConfig[] = [];

  services.forEach((service) => {
    if (isBaseRatePricing(service.pricingModel)) baseRateServices.push(service);
    else if (isTieredPricing(service.pricingModel))
      tierBasedServices.push(service);
  });

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
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {baseRateServices.map((service, idx) => {
                    service.pricingModel =
                      service.pricingModel as BaseRatePricing;
                    return (
                      <Card key={idx} className="overflow-hidden">
                        <CardHeader className="space-y-1">
                          <CardTitle>
                            {baseServiceFormValues.find(
                              (s) => s.value === service.name,
                            )?.label ?? service.name}
                          </CardTitle>
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
                                  {baseServiceFormValues.find(
                                    (s) => s.value === service.name,
                                  )?.label ?? service.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  ${service.pricingModel.basePrice} /{" "}
                                  {service.pricingModel.baseTime}{" "}
                                  {service.pricingModel.timeUnit}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  ${service.pricingModel.additionalPrice} /{" "}
                                  {service.pricingModel.additionalTime}{" "}
                                  {service.pricingModel.timeUnit}
                                </TableCell>
                              </TableRow>
                              {service.pricingModel.addons &&
                                Object.entries(service.pricingModel.addons).map(
                                  ([key, value], idx) => (
                                    <TableRow key={idx}>
                                      <TableCell className="whitespace-nowrap">
                                        {prettyPrint(key)}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        ${value}
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        -
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {tierBasedServices.map((service, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardHeader className="space-y-1">
                        <CardTitle>
                          {baseServiceFormValues.find(
                            (s) => s.value === service.name,
                          )?.label ?? service.name}
                        </CardTitle>
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
                            {isTieredPricing(service.pricingModel) &&
                              Object.entries(service.pricingModel.tiers).map(
                                ([key, value], idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="whitespace-nowrap">
                                      {key}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                      ${value}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
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
