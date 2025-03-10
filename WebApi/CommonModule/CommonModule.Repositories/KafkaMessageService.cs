using CommonModule.Core.Kafka;
using CommonModule.Interfaces;
using Microsoft.Extensions.Configuration;

namespace CommonModule.Repositories;

public class KafkaMessageService: IKafkaMessageService
{
    private readonly KafkaProducer _kafkaProducer;
    private readonly string _logTopic;

    public KafkaMessageService(
        IConfiguration configuration,
        KafkaProducer kafkaProducer)
    {
        _logTopic = configuration["Kafka:AuditTrailTopic"] ?? string.Empty;
        _kafkaProducer = kafkaProducer;
    }

    public async Task LogAuditTrailAsync(object log)
    {
        if (string.IsNullOrWhiteSpace(_logTopic))
        {
            return;
        }
        
        // TODO audit trail log warning empty topic
        
        await _kafkaProducer.ProduceAsync(_logTopic, log);
    }
}