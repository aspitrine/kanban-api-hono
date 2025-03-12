import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Input from '@/components/Input/Input';

function LoginPage() {
  async function onSubmitAction(formData: FormData) {
    const data = Object.fromEntries(formData);

    // Appeler l'API pour se connecter et rediriger l'utilisateur vers la page listant les tableaux
  }

  return (
    <div>
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card>
          <form action={onSubmitAction}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Connexion
            </h2>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="exemple@email.com"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Button className="w-full">Se connecter</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
