<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

class Mailer
{
    public static function send(string $toEmail, string $toName, string $subject, string $htmlBody): bool
    {
        $smtp = Config::get()['smtp'];
        if ($smtp['host'] === '' || $smtp['user'] === '' || $smtp['pass'] === '') {
            error_log('Mailer: SMTP is not configured, skipping send to ' . $toEmail);
            return false;
        }

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['user'];
            $mail->Password = $smtp['pass'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $smtp['port'];

            $mail->setFrom($smtp['from_email'] !== '' ? $smtp['from_email'] : $smtp['user'], $smtp['from_name']);
            $mail->addAddress($toEmail, $toName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            $mail->send();
            return true;
        } catch (PHPMailerException $e) {
            error_log('Mailer: failed to send to ' . $toEmail . ': ' . $mail->ErrorInfo);
            return false;
        }
    }
}
