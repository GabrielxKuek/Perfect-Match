import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SignupLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BEB7A4]">
      <Card className="w-full max-w-md mx-4 bg-[#FFFFFC]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

SignupLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default SignupLayout;