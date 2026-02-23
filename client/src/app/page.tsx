import { Container, Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center section-py">
            <Container narrow>
                <Card variant="glass" className="text-center space-y-6">
                    <CardHeader>
                        <CardTitle className="text-5xl text-gradient-gold">Vaidya Kesh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <p className="text-lg text-neutral-600">
                            Premium Ayurvedic hair care crafted with traditional ingredients for modern living.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <Button size="lg" variant="primary">
                                Shop Collection
                            </Button>
                            <Button size="lg" variant="outline">
                                Our Story
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </main>
    );
}

