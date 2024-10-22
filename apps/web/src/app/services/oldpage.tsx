import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Services() {
  const itemStyle = "min-h-8",
    listStyle = "mb-6";

  return (
    <Card className="flex flex-col h-full md:h-[32rem] w-full md:w-4/5">
      <CardHeader className="flex flex-row justify-center">
        <div>Our Services</div>
      </CardHeader>
      <CardContent className="h-full grid grid-rows-10 grid-cols-1 md:items-center justify-items-center">
        <Tabs
          defaultValue="aLaCarte"
          className="row-span-8 md:row-span-7 w-full md:w-[48rem]"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="aLaCarte">A La Carte</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          <TabsContent value="aLaCarte">
            <div className="grid grid-cols-1 md:grid-cols-2 h-56 gap-2 mb-4">
              <article>
                <div>
                  <h3 className="mb-4">Pet Walking</h3>
                  <ul className="mb-6">
                    <li className="min-h-8">30 mins - $__</li>
                    <li className="min-h-8">1hr - $__</li>
                    <li className="min-h-8">
                      Every 15 mins in addition to an hour. - $__
                    </li>
                  </ul>
                </div>
              </article>

              <hr className="h-4 md:hidden" />

              <article>
                <div>
                  <h3 className="mb-4">Pet Sitting</h3>
                  <ul className="mb-6">
                    <li className="min-h-8">Single Night - $__</li>
                    <li className="min-h-8">2 Consecutive Nights - $__</li>
                    <li className="min-h-8">
                      Additional hour earlier check-in or later check-out - $__
                    </li>
                    <li className="min-h-8">
                      Additional consecutive night - $__
                    </li>
                  </ul>
                  <p>Check-in at 6pm, Check-out 10am</p>
                </div>
              </article>
            </div>
          </TabsContent>
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 h-56 gap-2 mb-4">
              <article>
                <div>
                  <h3 className="mb-4">Monthly Pet Walking</h3>
                  <ul>
                    <li className="min-h-8">5 walks - $__</li>
                    <li className="min-h-8">10 walks - $__</li>
                    <li className="min-h-8">15 walks - $__</li>
                    <li className="min-h-8">20 walks - $__</li>
                    <li className="min-h-8">Per day add ons. - $__</li>
                  </ul>
                </div>
              </article>

              <hr className="h-4 md:hidden" />

              <article>
                <div>
                  <h3 className="mb-4">Monthly Pet Sitting</h3>
                  <ul>
                    <li className="min-h-8">
                      1-4 weekends - $__/2-night-weekends (fri-sun)
                    </li>
                    <li className="min-h-8">4 nights - $__</li>
                    <li className="min-h-8">
                      Additional hour earlier check-in or later check-out - $__
                    </li>
                  </ul>
                  <p>Check-in at 6pm, Check-out 10am</p>
                </div>
              </article>
            </div>
          </TabsContent>
        </Tabs>
        <p className="row-span-2 md:row-span-3 flex justify-center">
          All services are available to dogs or cats in or within 5 miles of Gig
          Harbor, WA.{" "}
        </p>
      </CardContent>
    </Card>
  );
}
