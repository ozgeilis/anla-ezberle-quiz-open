import React from "react";
import { router } from "expo-router";
import { Button, Card, Page, Txt } from "../components/ui";
export default function NotFound() {
  return (
    <Page
      title="Bu ekranı bulamadık"
      subtitle="Yeni bir keşif için ana sayfaya dön."
    >
      <Card style={{ gap: 16 }}>
        <Txt>
          Bağlantı eski veya eksik olabilir. Oyun kayıtların bu işlemden
          etkilenmez.
        </Txt>
        <Button
          title="Ana sayfaya dön"
          icon="home"
          onPress={() => router.replace("/")}
        />
      </Card>
    </Page>
  );
}
